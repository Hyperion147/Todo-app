package router

import (
	"github.com/Hyperion147/Todo-app/middlewares"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func Router() *mux.Router {

	router := mux.NewRouter()
	
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With"}),
		handlers.OptionStatusCode(204),
		handlers.AllowCredentials(),
	)
	
	api := router.PathPrefix("/api").Subrouter()
	api.Use(cors)
	
	api.HandleFunc("/task", middlewares.GetAllTasks).Methods("GET", "OPTIONS")
	api.HandleFunc("/task", middlewares.CreateTask).Methods("POST", "OPTIONS")
	api.HandleFunc("/task/{id}", middlewares.TaskComplete).Methods("PUT", "OPTIONS")
	api.HandleFunc("/undoTask/{id}", middlewares.UndoTask).Methods("PUT", "OPTIONS")
	api.HandleFunc("/deleteTask/{id}", middlewares.DeleteTask).Methods("DELETE", "OPTIONS")
	api.HandleFunc("/deleteAllTasks", middlewares.DeleteAllTasks).Methods("DELETE", "OPTIONS")

	return router
}
