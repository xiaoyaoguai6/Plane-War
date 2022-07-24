package main

import (
	"demo/src/db"
	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()

	engine.POST("/api/register", db.Register)
	engine.GET("/api/login", db.Login)
	engine.GET("/api/list", db.List)
	engine.GET("/api/score", db.Score)
	engine.GET("/api/update", db.UpdateScore)
	engine.Run(":6616")
}
