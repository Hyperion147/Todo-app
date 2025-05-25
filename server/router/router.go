package router

import (
	"Todo-app/middlewares"

	"github.com/gorilla/mux"
)

func Router() *mux.Router {

	router := mux.NewRouter()
	router.HandleFunc("/api/task", middlewares.GetAllTasks).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/task", middlewares.CreateTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/task/{id}", middlewares.TaskComplete).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/undoTask/{id}", middlewares.UndoTask).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/deleteTask/{id}", middlewares.DeleteTask).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/deleteAllTasks/{id}", middlewares.DeleteAllTasks).Methods("DELETE", "OPTIONS")
	return router
}
