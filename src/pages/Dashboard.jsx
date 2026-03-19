import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaTrash } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [foodForm, setFoodForm] = useState({ name: "", fat: "", protein: "", carbs: "" });
  const [mealForm, setMealForm] = useState({ name: "" });
  const [dailySummary, setDailySummary] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then(res => setUser(res.data))
      .catch(() => navigate("/"));
    fetchFoods();
    fetchMeals();
  }, [navigate]);

  const fetchFoods = async () => {
    try { const res = await API.get("/foods/"); setFoods(res.data); } 
    catch (err) { console.error(err); }
  };

  const fetchMeals = async () => {
    try { const res = await API.get("/meals/"); setMeals(res.data); } 
    catch (err) { console.error(err); }
  };

  // Add Food
  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await API.post("/foods/", {
        name: foodForm.name,
        fat: parseFloat(foodForm.fat),
        protein: parseFloat(foodForm.protein),
        carbs: parseFloat(foodForm.carbs)
      });
      toast.success("Food added!");
      setFoodForm({ name: "", fat: "", protein: "", carbs: "" });
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error adding food");
    }
  };

  // Add Meal
  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      await API.post("/meals/", { name: mealForm.name, food_ids: [] });
      toast.success("Meal created!");
      setMealForm({ name: "" });
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error creating meal");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Daily Summary
  const fetchDailySummary = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await API.get(`/meals/summary/${today}`);
      setDailySummary(res.data);
    } catch (err) {
      toast.error("Error fetching daily summary");
    }
  };

  // Drag & Drop
  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const foodId = parseInt(draggableId);

    if (destination.droppableId.startsWith("meal-")) {
      const mealId = parseInt(destination.droppableId.split("-")[1]);
      const meal = meals.find(m => m.id === mealId);
      if (!meal) return;

      const updatedFoodIds = [...meal.foods.map(f => f.id)];
      if (!updatedFoodIds.includes(foodId)) updatedFoodIds.push(foodId);

      try {
        await API.put(`/meals/${mealId}`, { name: meal.name, food_ids: updatedFoodIds });
        toast.success("Food added to meal!");
        fetchMeals();
      } catch (err) {
        toast.error("Error updating meal with food");
      }
    }
  };

  // Delete meal
  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try { await API.delete(`/meals/${mealId}`); toast.success("Meal deleted!"); fetchMeals(); }
    catch (err) { toast.error("Error deleting meal"); }
  };

  // Delete food from DB
  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food?")) return;
    try {
      await API.delete(`/foods/${foodId}`);
      toast.success("Food deleted!");
      fetchFoods();
      fetchMeals(); // update meals in case this food existed
    } catch (err) {
      toast.error("Error deleting food");
    }
  };

  // Delete food from a meal only
  const handleDeleteFoodFromMeal = async (mealId, foodId) => {
    if (!window.confirm("Remove this food from meal?")) return;
    try {
      const meal = meals.find(m => m.id === mealId);
      const updatedFoodIds = meal.foods.filter(f => f.id !== foodId).map(f => f.id);
      await API.put(`/meals/${mealId}`, { name: meal.name, food_ids: updatedFoodIds });
      toast.success("Food removed from meal!");
      fetchMeals();
    } catch (err) {
      toast.error("Error removing food from meal");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="navbar">
        <h2 className="logo">🍽️ Macro Tracker</h2>
        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        {/* Top */}
        <section className="dashboard-top">
          <div className="user-card">
            <h2>Welcome, {user?.username || "Loading..."}</h2>
            {user && <p>Email: {user.email}</p>}
          </div>
          <div className="stats-card">
            <p>Total Foods: <strong>{foods.length}</strong></p>
            <p>Total Meals: <strong>{meals.length}</strong></p>
          </div>
          <button className="btn summary-btn" onClick={fetchDailySummary}>📊 Daily Meal Summary</button>
        </section>

        {/* Daily Summary */}
        {dailySummary && (
          <section className="summary-card">
            <h3>Daily Summary ({dailySummary.date})</h3>
            <div className="daily-summary-table">
              <table>
                <thead>
                  <tr><th>Macro</th><th>Total</th></tr>
                </thead>
                <tbody>
                  <tr><td>Calories</td><td>{dailySummary.total_calories}</td></tr>
                  <tr><td>Protein</td><td>{dailySummary.total_protein}g</td></tr>
                  <tr><td>Fat</td><td>{dailySummary.total_fat}g</td></tr>
                  <tr><td>Carbs</td><td>{dailySummary.total_carbs}g</td></tr>
                </tbody>
              </table>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: "Calories", value: dailySummary.total_calories },
                { name: "Protein", value: dailySummary.total_protein },
                { name: "Fat", value: dailySummary.total_fat },
                { name: "Carbs", value: dailySummary.total_carbs }
              ]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Forms */}
        <section className="form-section">
          <div className="form-card">
            <h3>Add Food</h3>
            <form onSubmit={handleAddFood}>
              <input type="text" placeholder="Name" value={foodForm.name} onChange={e => setFoodForm({...foodForm, name: e.target.value})} required/>
              <input type="number" placeholder="Fat (g)" value={foodForm.fat} onChange={e => setFoodForm({...foodForm, fat: e.target.value})} required/>
              <input type="number" placeholder="Protein (g)" value={foodForm.protein} onChange={e => setFoodForm({...foodForm, protein: e.target.value})} required/>
              <input type="number" placeholder="Carbs (g)" value={foodForm.carbs} onChange={e => setFoodForm({...foodForm, carbs: e.target.value})} required/>
              <button type="submit" className="btn primary-btn">Add Food</button>
            </form>
          </div>

          <div className="form-card">
            <h3>Create Meal</h3>
            <form onSubmit={handleAddMeal}>
              <input type="text" placeholder="Meal Name" value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} required/>
              <button type="submit" className="btn primary-btn">Create Meal</button>
            </form>
          </div>
        </section>

        {/* Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <section className="meals-section">
            <h3>Available Foods</h3>
            <Droppable droppableId="foodList" isDropDisabled={true}>
              {(provided) => (
                <div className="food-list" ref={provided.innerRef} {...provided.droppableProps}>
                  {foods.map((f, index) => (
                    <Draggable key={f.id} draggableId={f.id.toString()} index={index}>
                      {(provided) => (
                        <div className="food-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {f.name} ({f.protein}P / {f.fat}F / {f.carbs}C)
                          <button className="delete-btn" onClick={() => handleDeleteFood(f.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <h3>My Meals</h3>
            <div className="meals-grid">
              {meals.map(m => (
                <Droppable droppableId={`meal-${m.id}`} key={m.id}>
                  {(provided, snapshot) => (
                    <div className={`meal-card ${snapshot.isDraggingOver ? 'drag-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="meal-card-header">
                        <h4>{m.name}</h4>
                        <button className="delete-btn" onClick={() => handleDeleteMeal(m.id)}>🗑️</button>
                      </div>

                      <table className="meal-table">
                        <thead>
                          <tr>
                            <th>Food</th><th>Calories</th><th>Protein</th><th>Fat</th><th>Carbs</th><th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {m.foods.map(f => {
                            const calories = f.protein*4 + f.carbs*4 + f.fat*9;
                            return (
                              <tr key={f.id}>
                                <td>{f.name}</td>
                                <td>{calories}</td>
                                <td>{f.protein}</td>
                                <td>{f.fat}</td>
                                <td>{f.carbs}</td>
                                <td>
                                  <button className="delete-btn" onClick={() => handleDeleteFoodFromMeal(m.id, f.id)}>
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>

                      <div className="meal-macros">
                        <strong>Totals:</strong>
                        <span>Calories: {m.foods.reduce((sum,f)=>sum+(f.protein*4+f.carbs*4+f.fat*9),0)}</span>
                        <span>Protein: {m.foods.reduce((sum,f)=>sum+f.protein,0)}g</span>
                        <span>Fat: {m.foods.reduce((sum,f)=>sum+f.fat,0)}g</span>
                        <span>Carbs: {m.foods.reduce((sum,f)=>sum+f.carbs,0)}g</span>
                      </div>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </section>
        </DragDropContext>

      </main>

      <ToastContainer />
    </div>
  );
}