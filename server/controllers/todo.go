package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Hyperion147/Todo-app/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TodoController struct {
	DB         *mongo.Database
	collection *mongo.Collection
}

func NewTodoController(db *mongo.Database) *TodoController {
	return &TodoController{
		DB:         db,
		collection: db.Collection("todos"),
	}
}

func (tc *TodoController) CreateTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	var input models.TodoList
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	todo := models.TodoList{
		Task:      input.Task,
		Status:    false,
		UserID:    objID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result, err := tc.collection.InsertOne(context.Background(), todo)
	if err != nil {
		http.Error(w, "Error creating todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   map[string]interface{}{"id": result.InsertedID},
	})
}

func (tc *TodoController) GetAllTasks(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	cur, err := tc.collection.Find(context.Background(), bson.M{"userID": objID})
	if err != nil {
		http.Error(w, "Error fetching tasks", http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	var results []models.TodoList
	for cur.Next(context.Background()) {
		var result models.TodoList
		if err := cur.Decode(&result); err != nil {
			http.Error(w, "Error decoding task", http.StatusInternalServerError)
			return
		}
		results = append(results, result)
	}
	if err := cur.Err(); err != nil {
		http.Error(w, "Error", http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   results,
	})

}

func (tc *TodoController) TaskComplete(w http.ResponseWriter, r *http.Request) {
	tc.updateTaskStatus(w, r, true)
}

func (tc *TodoController) UndoTask(w http.ResponseWriter, r *http.Request) {
	tc.updateTaskStatus(w, r, false)
}

func (tc *TodoController) updateTaskStatus(w http.ResponseWriter, r *http.Request, status bool) {
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(string)
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	taskObjID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	filter := bson.M{
		"_id": taskObjID,
		"userID": userObjID,
	}
	update := bson.M{
		"status": status,
		"updatedAT": time.Now(),
	}

	result, err := tc.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Error updating task", http.StatusInternalServerError)
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Task not found", http.StatusNotFound)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   map[string]string{"id": taskID},
	})
}

func (tc *TodoController) DeleteTask(w http.ResponseWriter, r *http.Request) {
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(string)
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	taskObjID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	filter := bson.M{
		"_id":    taskObjID,
		"userID": userObjID,
	}

	result, err := tc.collection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   map[string]string{"id": taskID},
	})
}

func (tc *TodoController) DeleteAllTasks(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	filter := bson.M{"userID": userObjID}
	result, err := tc.collection.DeleteMany(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error deleting tasks", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   map[string]int64{"deleted_count": result.DeletedCount},
	})
}
