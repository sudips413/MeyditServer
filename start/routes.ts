/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
//controller for users
Route.get('api/users','UsersController.index')
Route.post('api/auth/register','UsersController.create')
Route.post('api/auth/login','UsersController.login')
Route.get('api/getUser/:id', 'UsersController.getById')

//controller for customer Orders
Route.get('api/orders','OrderDesignsController.index')
Route.get('api/getOrder/:id', 'OrderDesignsController.getById')

//create a new order with multiple image upload
Route.post('api/postJob','OrderDesignsController.postJob')

//mailing 
// Route.post('api/sendMail','sendMailsController.sendMail')
Route.post('api/sendMail','MailServicesController.sendMail')
