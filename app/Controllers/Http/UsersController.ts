// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CustomerOrder from 'App/Models/CustomerOrder'
export default class UsersController {
  public async index (_ctx:HttpContextContract){
    return await User.all()
  }
  public async create ({request,response}:HttpContextContract){
    console.log(request.body())
    const userSchema = schema.create({
      username: schema.string([
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string([
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string([
        rules.confirmed('password'),
      ]),
      role: schema.string(),
    })
    try{
      const payload = await request.validate({ schema: userSchema })
      payload.password = await Hash.make(payload.password)
      const user = await User.create({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      })
      response.status(201).json({
        message: 'User created successfully',
        success: true,
        data: user,
      })
    } catch(e){
      console.log(e.messages)
      const body = request.body()
      if (await User.findBy('username', body.username)) {
        response.json({
          message: 'Username already registered',
          success: false,
        })
      } else if (await User.findBy('email', body.email)) {
        response.json({
          message: 'Email already registered',
          success: false,
        })
      } else{
        response.json({
          message: 'Something went wrong',
          success: false,
        })
      }
    }
  }
  public async login ({request,response}:HttpContextContract){
    const userSchema = schema.create({
      email: schema.string(),
      password: schema.string([
        rules.confirmed('password'),
      ]),
    })
    try{
      const payload = await request.validate({ schema: userSchema })
      const user = await User.findBy('email', payload.email)
      if (user) {
        const passwordVerified = await Hash.verify(user.password, payload.password)
        if (passwordVerified) {
          const orders = await CustomerOrder.all()
          const send = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }
          response.json({
            message: 'Login successful',
            success: true,
            // data: send accept password
            data: send,
            allOrders: orders,
          })
        } else {
          response.json({
            message: 'Invalid credentials',
            success: false,
          })
        }
      } else {
        response.json({
          message: 'Invalid credentials',
          success: false,
        })
      }
    } catch(e){
      response.json({
        message: 'Something went wrong',
        success: false,
      })
    }
  }

  public async getById ({params,response}:HttpContextContract){
    try{
      const user = await User.find(params.id)
      if (user) {
        const orders = await CustomerOrder.all()
        response.json({
          message: 'User found',
          success: true,
          data: user,
          allOrders: orders,
        })
      } else {
        response.json({
          message: 'User not found',
          success: false,
        })
      }
    } catch(e){
      response.json({
        message: 'Something went wrong',
        success: false,
      })
    }
  }
}

