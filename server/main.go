package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Hyperion147/Todo-app/tree/main/server/router"
)

func main() {
	r := router.Router()
	fmt.Println("Starting the server on port 6969")

	log.Fatal(http.ListenAndServe(":6969", r))
}
