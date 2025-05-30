package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	UserID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name string `json:"name" bson:"name"`
	Email string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
}

type SignUpInput struct {
	Name string `json:"name" bson:"name" binding:"required"`
	Email string `json:"email" bson:"email" binding:"required"`
	Password string `json:"password" bson:"password" binding:"required,min=8"`
	PasswordConfirm string `json:"passwordConfirm" bson:"passwordConfirm,omitempty" binding:"required"`
}

type LogInInput struct {
	Email string `json:"email" bson:"email" binding:"required"`
	Password string `json:"password" bson:"password" binding:"required"`
}