package db

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/jackc/pgx/v4"
	"log"
	"os"
	"time"
)

func Login(ctx *gin.Context) {
	name := ctx.Query("name")
	pwd := ctx.Query("pwd")
	var names string
	var pwds string
	var roots string
	url := "postgres://postgres:****@*****:5432/postgres"
	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())
	conn.QueryRow(context.Background(), "select name, pwd, root from public.users where name=$1", name).Scan(&names, &pwds, &roots)
	if pwds == pwd {
		if roots == "1" {
			data := gin.H{"name": names, "status": "1",
				"description": 1, "pwd": pwds}
			ctx.JSON(200, data)
		} else {
			data := gin.H{"name": names, "status": "1",
				"description": "Web Framework", "pwd": pwds}
			ctx.JSON(200, data)
		}
	} else {
		data := gin.H{"status": "0"}
		ctx.JSON(400, data)
	}

	//fmt.Println(name, pwd, names, pwds)
}

type Person struct {
	Name string `json:"name"`
	Pwd  string `json:"pwd"`
}

func Register(ctx *gin.Context) {
	var person Person
	if ctx.ShouldBind(&person) == nil {
		fmt.Println(person.Name)
		fmt.Println(person.Pwd)
	}

	url := "postgres://postgres:****@*****/postgres"
	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	cmd := fmt.Sprintf("insert into users (name,pwd) values ('%s' ,%s)", person.Name, person.Pwd)
	_, err = conn.Exec(context.Background(), cmd)
	fmt.Println(err)
	if err != nil {
		data := gin.H{"status": "0"}
		ctx.JSON(400, data)
	} else {
		data := gin.H{"status": "1"}
		ctx.JSON(200, data)
	}
}

type Status struct {
	Name        string `field:"name"`
	Status      int    `field:"status"`
	Description string `field:"root"`
	Pwd         string `field:"pwd"`
}

func List(ctx *gin.Context) {

	url := "postgres://postgres:****@******/postgres"
	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())
	rows, err := conn.Query(context.Background(), "select name, pwd, root from public.users")
	defer rows.Close()
	nameList := []Status{}
	for rows.Next() {
		status := new(Status)
		err := rows.Scan(&status.Name, &status.Pwd, &status.Description)
		nameList = append(nameList, *status)
		if err != nil {
			fmt.Printf("scan failed, err:%v\n", err)
			data := gin.H{"status": "0"}
			ctx.JSON(400, data)
			return
		}

	}
	data := gin.H{"status": 1, "list": nameList}
	ctx.JSON(200, data)
	//fmt.Println(name, pwd, names, pwds)
}

func Score(ctx *gin.Context) {
	host := "******"
	port := 6379

	name := ctx.Query("name")
	serv := fmt.Sprintf("%s:%d", host, port)
	log.Printf("connecting redis to %s", serv)
	redisPool := &redis.Pool{
		MaxIdle:     32,
		IdleTimeout: 60 * time.Minute,
		Dial: func() (conn redis.Conn, err error) {
			for {
				conn, err = redis.Dial("tcp", serv, redis.DialPassword("*******"))
				if err != nil {
					log.Printf(err.Error())
					<-time.After(time.Second * 15)
					continue
				}
				log.Printf("redis connected with " + serv)
				break
			}
			return
		},

		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
	c := redisPool.Get()
	_, err := c.Do("INFO")
	if err != nil {
		log.Fatalf(err.Error())
	}
	log.Printf("redis: %s connection verified\n", serv)

	defer c.Close()
	//-------------------

	//var r interface{}
	r, err := c.Do("json.get", name)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	s, err := redis.String(r, err)

	data := gin.H{"list": s}
	ctx.JSON(200, data)
}

func UpdateScore(ctx *gin.Context) {
	host := "******"
	port := 6379

	name := ctx.Query("name")
	score := ctx.Query("score")
	serv := fmt.Sprintf("%s:%d", host, port)
	log.Printf("connecting redis to %s", serv)
	redisPool := &redis.Pool{
		MaxIdle:     32,
		IdleTimeout: 60 * time.Minute,
		Dial: func() (conn redis.Conn, err error) {
			for {
				conn, err = redis.Dial("tcp", serv, redis.DialPassword("******"))
				if err != nil {
					log.Printf(err.Error())
					<-time.After(time.Second * 15)
					continue
				}
				log.Printf("redis connected with " + serv)
				break
			}
			return
		},

		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
	c := redisPool.Get()
	_, err := c.Do("INFO")
	if err != nil {
		log.Fatalf(err.Error())
	}
	log.Printf("redis: %s connection verified\n", serv)

	defer c.Close()
	//-------------------

	//var r interface{}
	//cmd := fmt.Sprintf("insert into users (name,pwd) values ('%s' ,%s)", person.Name, person.Pwd)
	tm := fmt.Sprintf("{\"score\": \"%s\"}", score)
	_, err = c.Do("json.set", name, ".", tm)
	if err != nil {
		data := gin.H{"status": "0"}
		ctx.JSON(400, data)
	} else {
		data := gin.H{"status": "1"}
		ctx.JSON(200, data)
	}
}
