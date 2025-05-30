package router

import (
	"github.com/Hyperion147/Todo-app/controllers"
	"github.com/Hyperion147/Todo-app/middlewares"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func Router(db *mongo.Database) *mux.Router {

	router := mux.NewRouter()
	authController := controllers.NewAuthController(db)
	
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With"}),
		handlers.OptionStatusCode(204),
		handlers.AllowCredentials(),
	)
	router.Use(cors)

	authRouter := router.PathPrefix("/api/auth").Subrouter()
	authRouter.HandleFunc("/register", authController.SignUpUser).Methods("POST")
	authRouter.HandleFunc("/login", authController.LogInUser).Methods("POST")
	authRouter.HandleFunc("/logout", authController.LogoutUser).Methods("GET")

	api := router.PathPrefix("/api").Subrouter()
	api.Use(middlewares.AuthMiddleware)
	
	api.HandleFunc("/task", middlewares.GetAllTasks).Methods("GET", "OPTIONS")
	api.HandleFunc("/task", middlewares.CreateTask).Methods("POST", "OPTIONS")
	api.HandleFunc("/task/{id}", middlewares.TaskComplete).Methods("PUT", "OPTIONS")
	api.HandleFunc("/undoTask/{id}", middlewares.UndoTask).Methods("PUT", "OPTIONS")
	api.HandleFunc("/deleteTask/{id}", middlewares.DeleteTask).Methods("DELETE", "OPTIONS")
	api.HandleFunc("/deleteAllTasks", middlewares.DeleteAllTasks).Methods("DELETE", "OPTIONS")

	return router
}
