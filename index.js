const express = require("express")
const { send } = require("express/lib/response")
const uuid = require("uuid")
const app = express()
const port = 3000
app.use(express.json())


const orders = []

const checksMiddleware = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) { return response.status(404).json({ message: "order not found" }) }


    request.userIndex = index
    request.userId = id

    next()

}


const checkMethodUrl = (request, response, next) => {

    console.log(request.method)
    console.log(request.url)

    next()
}


app.post('/users', checkMethodUrl, (request, response) => {

    const { order, clientName, price, status } = request.body

    const client = { id: uuid.v4(), order, clientName, price, status }


    orders.push(client)


    return response.status(201).json(client)

})



app.get('/users/', checkMethodUrl, (request, response) => {

    return response.json(orders)

})


app.put('/users/:id', checksMiddleware, checkMethodUrl, (request, response) => {


    const { order, clientName, price, status } = request.body
    const index = request.userIndex
    const id = request.userId
    const updateOrders = { id, order, clientName, price, status }

    orders[index] = updateOrders


    return response.json(updateOrders)

})

app.delete('/users/:id', checksMiddleware, checkMethodUrl, (request, response) => {

    const index = request.userIndex


    orders.splice(index, 1)

    return response.status(204).json()

})


app.get('/users/:id', checksMiddleware, checkMethodUrl, (request, response) => {

    const index = request.userIndex

    return response.json(orders[index])

})


app.patch('/users/:id', checksMiddleware, checkMethodUrl, (request, response) => {

    const index = request.userIndex

    const { order, clientName, price, status } = request.body

    orders[index].status = "Pronto"

    return response.json(orders[index])


})


app.listen(port, () => {
    console.log(`✅ Server started on port ${port} ✅`)


})