package router

import (
	"github.com/gorilla/mux"
	"github.com/Hyperion147/Todo-app/controllers"
)

type AuthRoutes struct{
	authController *controllers.AuthController
}

func NewAuthRouter(authController *controllers.AuthController) *AuthRoutes{
	return &AuthRoutes{authController}
}

func (ar *AuthRoutes) RegisterRouter(router *mux.Router){
	authRouter := router.PathPrefix("/auth").Subrouter()

	authRouter.HandleFunc("/register", ar.authController.SignUpUser).Methods("POST")
	authRouter.HandleFunc("/login", ar.authController.LogInUser).Methods("POST")
	authRouter.HandleFunc("/logout", ar.authController.LogoutUser).Methods("GET")
}