package router

import (
	"encoding/json"
	"net/http"

	"github.com/Hyperion147/Todo-app/config"
	"github.com/Hyperion147/Todo-app/controllers"
	"github.com/Hyperion147/Todo-app/middlewares"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func Router(db *mongo.Database, cfg *config.Config) *mux.Router {

	router := mux.NewRouter()
	
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	router.Use(corsMiddleware)

	authController := controllers.NewAuthController(db, cfg)

	authRouter := router.PathPrefix("/api/auth").Subrouter()
	authRouter.HandleFunc("/register", authController.SignUpUser).Methods("POST")
	authRouter.HandleFunc("/login", authController.LogInUser).Methods("POST")
	authRouter.HandleFunc("/logout", authController.LogoutUser).Methods("GET")

	api := router.PathPrefix("/api").Subrouter()
	api.Use(middlewares.AuthMiddleware)
	
	taskController := controllers.NewTodoController(db)
	api.HandleFunc("/task", taskController.GetAllTasks).Methods("GET", "OPTIONS")
	api.HandleFunc("/task", taskController.CreateTask).Methods("POST", "OPTIONS")
	api.HandleFunc("/task/{id}", taskController.TaskComplete).Methods("PUT", "OPTIONS")
	api.HandleFunc("/undoTask/{id}", taskController.UndoTask).Methods("PUT", "OPTIONS")
	api.HandleFunc("/deleteTask/{id}", taskController.DeleteTask).Methods("DELETE", "OPTIONS")
	api.HandleFunc("/deleteAllTasks", taskController.DeleteAllTasks).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}).Methods("GET")

	return router
}
