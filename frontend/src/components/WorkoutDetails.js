import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()

  // State for editing
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(workout.title)
  const [editLoad, setEditLoad] = useState(workout.load)
  const [editReps, setEditReps] = useState(workout.reps)

  const handleClick = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'DELETE',
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
    console.log('id', json._id)
  }

  //==========================
  //==========================

  const handleUpdate = async () => {
    console.log('Payload:', {
      title: editTitle,
      load: editLoad,
      reps: editReps,
    });

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editTitle,
        load: editLoad,
        reps: editReps,
      }),
    })
    const json = await response.json()
    console.log('Updated Workout:', json); // Log the response to verify

    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json });
      setIsEditing(false); // Exit edit mode
    } else {
      console.error('Failed to update workout:', json.error);
    }
  }

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            type="number"
            value={editLoad}
            onChange={(e) => setEditLoad(e.target.value)}
            placeholder="Load (kg)"
          />
          <input
            type="number"
            value={editReps}
            onChange={(e) => setEditReps(e.target.value)}
            placeholder="Number of reps"
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Number of reps: </strong>
            {workout.reps}
          </p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <span className="material-symbols-outlined" onClick={handleClick}>
            delete
          </span>
          
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails
