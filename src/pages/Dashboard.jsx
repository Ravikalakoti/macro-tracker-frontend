import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [foodForm, setFoodForm] = useState({ name: "", fat: "", protein: "", carbs: "" });
  const [mealForm, setMealForm] = useState({ name: "" });
  const [dailySummary, setDailySummary] = useState(null);

  // Fetch user, foods, and meals
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
      await API.post("/meals/", { 
        name: mealForm.name,
        food_ids: []  // ⚡ Must include this, even if empty
      });
      toast.success("Meal created!");
      setMealForm({ name: "" });
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error creating meal");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchDailySummary = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await API.get(`/summary/${today}`);
      setDailySummary(res.data);
    } catch (err) {
      toast.error("Error fetching daily summary");
    }
  };

  // Drag & Drop handler
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const foodId = parseInt(draggableId);

    // Dropping into a meal
    if (destination.droppableId.startsWith("meal-")) {
      const mealId = parseInt(destination.droppableId.split("-")[1]);
      const meal = meals.find(m => m.id === mealId);
      if (!meal) return;

      // Updated food_ids for the meal
      const updatedFoodIds = [...meal.foods.map(f => f.id)];
      if (!updatedFoodIds.includes(foodId)) updatedFoodIds.push(foodId);

      try {
        await API.put(`/meals/${mealId}`, {
          name: meal.name,
          food_ids: updatedFoodIds
        });
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
    try {
      await API.delete(`/meals/${mealId}`);
      toast.success("Meal deleted!");
      fetchMeals();
    } catch (err) {
      toast.error("Error deleting meal");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="navbar">
        <h2 className="logo">🍽️ Macro Tracker</h2>
        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        {/* Top Section */}
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
            <p>Calories: <strong>{dailySummary.total_calories}</strong> kcal</p>
            <p>Fat: <strong>{dailySummary.total_fat}</strong> g</p>
            <p>Protein: <strong>{dailySummary.total_protein}</strong> g</p>
            <p>Carbs: <strong>{dailySummary.total_carbs}</strong> g</p>
          </section>
        )}

        {/* Forms */}
        <section className="form-section">
          {/* Add Food */}
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

          {/* Create Meal */}
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
                        <div
                          className="food-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {f.name} ({f.protein}P / {f.fat}F / {f.carbs}C)
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
              {meals.map(m => {
                const totalFat = m.foods.reduce((sum, f) => sum + f.fat, 0);
                const totalProtein = m.foods.reduce((sum, f) => sum + f.protein, 0);
                const totalCarbs = m.foods.reduce((sum, f) => sum + f.carbs, 0);
                const totalCalories = totalFat*9 + (totalProtein + totalCarbs)*4;

                return (
                  <Droppable droppableId={`meal-${m.id}`} key={m.id}>
                    {(provided, snapshot) => (
                      <div
                        className={`meal-card ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="meal-card-header">
                          <h4>{m.name}</h4>
                          <button className="delete-btn" onClick={() => handleDeleteMeal(m.id)}>🗑️</button>
                        </div>

                        {/* Foods in Meal with individual macros */}
                        <div className="meal-foods-list">
                          {m.foods.map((f, index) => (
                            <div key={f.id} className="meal-food-item">
                              <span>{f.name}</span>
                              <span>🔥 {f.protein*4 + f.carbs*4 + f.fat*9} kcal</span>
                              <span>💪 Protein: {f.protein}g</span>
                              <span>🧈 Fat: {f.fat}g</span>
                              <span>🍞 Carbs: {f.carbs}g</span>
                            </div>
                          ))}
                        </div>

                        {/* Meal Totals */}
                        <div className="meal-macros">
                          <strong>Meal Totals:</strong>
                          <span>🔥 {totalCalories} kcal</span>
                          <span>💪 {totalProtein}g Protein</span>
                          <span>🧈 {totalFat}g Fat</span>
                          <span>🍞 {totalCarbs}g Carbs</span>
                        </div>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              })}
            </div>
          </section>
        </DragDropContext>

      </main>

      <ToastContainer />
    </div>
  );
}