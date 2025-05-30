package database

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
	Client *mongo.Client
	DB *mongo.Database
}

func NewMongoDB(uri, dbname string) (*MongoDB, error){
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri).SetTLSConfig(&tls.Config{InsecureSkipVerify: false})

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("Failed to connect to MongoDB: %w", err)
	}

	if err = client.Ping(ctx, nil)
	err != nil{
		return nil, fmt.Errorf("Failed to ping MongoDB: %w", err)
	}
	log.Println("Connected to MongoDB")
	return &MongoDB{
		Client: client,
		DB: client.Database(dbname),
	}, nil
}

func (m *MongoDB) Close(){
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := m.Client.Disconnect(ctx)
	err != nil{
		log.Println("Failed to Disconnect MongoDB: %v", err)
	}
}
