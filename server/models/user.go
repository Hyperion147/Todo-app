package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name"`
	Email     string             `json:"email" bson:"email"`
	Password  string             `json:"-" bson:"password"`
	Role      string             `json:"role" bson:"role"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type SignUpInput struct {
	Name            string `json:"name" bson:"name" binding:"required"`
	Email           string `json:"email" bson:"email" binding:"required"`
	Password        string `json:"password" bson:"password" binding:"required,min=8"`
	PasswordConfirm string `json:"passwordConfirm" bson:"passwordConfirm,omitempty" binding:"required"`
}

type LogInInput struct {
	Email    string `json:"email" bson:"email" binding:"required"`
	Password string `json:"password" bson:"password" binding:"required"`
}
