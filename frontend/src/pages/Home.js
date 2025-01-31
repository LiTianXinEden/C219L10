import { useEffect } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    console.log("User:", user); // Debugging
    if (!user) return; // Prevent API calls if user is not loaded
  
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
  
        const json = await response.json();
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };
  
    fetchWorkouts();
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm />
    </div>
    
  )
}

export default Home