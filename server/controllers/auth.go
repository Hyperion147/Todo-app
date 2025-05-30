package controllers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"github.com/Hyperion147/Todo-app/models"
)

type AuthController struct {
	DB *mongo.Database
}

func NewAuthController(DB *mongo.Database) *AuthController {
	return &AuthController{DB}
}

func (ac *AuthController) SignUpUser(w http.ResponseWriter, r *http.Request) {
	var payload models.SignUpInput

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Password != payload.PasswordConfirm {
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		return
	}

	hashedPassword, err:= bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil{
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	newUser := models.User{
		Name: payload.Name,
		Email: payload.Email,
		Password: string(hashedPassword),
	}

	_, err = ac.DB.Collection("users").InsertOne(r.Context(), newUser)
	if err != nil {
		http.Error(w, "User already exists.", http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data": newUser,
	})
}

func (ac *AuthController) LogInUser(w http.ResponseWriter, r *http.Request){
	var payload models.LogInInput

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil{
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user models.User
	err = ac.DB.Collection("users").FindOne(r.Context(), bson.M{"email": payload.Email}).Decode(&user)
	if err != nil{
		http.Error(w, "Invalid password or email", http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		http.Error(w, "Invalid password or email", http.StatusBadRequest)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.UserID.Hex(),
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	godotenv.Load()
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))
	if err != nil{
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name: "token",
		Value: tokenString,
		Path: "/",
		MaxAge: 3600*24,
		HttpOnly: true,
		Secure: true,
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"token": tokenString,
	})
}

func (ac *AuthController) LogoutUser(w http.ResponseWriter, r *http.Request){
	http.SetCookie(w, &http.Cookie{
		Name: "token",
		Value: "",
		Path: "/",
		MaxAge: -1,
		HttpOnly: true,
	})
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
	})
}
