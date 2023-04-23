import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import CustomerOrder from 'App/Models/CustomerOrder'
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'

export default class OrderDesignsController {
  public async index (_ctx: HttpContextContract) {
    return await CustomerOrder.all()
  }
  public async postJob ({request, response}: HttpContextContract) {
    // console.log(request.body())
    // convert to integer
    const orderSchema = schema.create({
      customer_id: schema.string(),
      firstName: schema.string(),
      lastName: schema.string(),
      phoneNumber: schema.string(),
      emailAddress: schema.string(),
      address: schema.string(),
      postcode: schema.string(),
      state: schema.string(),
      clothingTypes: schema.string(),
      // images: schema.string(),
      description: schema.string(),
      budget: schema.string(),
    })
    var images= request.files('images')
    console.log('images')
    console.log(images)

    try{
      // validate orderSchema except images and customer_id   
      const payload = await request.validate({
        schema: orderSchema,
      })
      const paths: Record<number, string> = {}
      if (!images) { // Check if files are present and it's an array
        return response.status(400).json({
          message: 'No image uploaded',
          success: false,
        })
      } else{
        for (var i = 0; i < images.length; i++) {
          const originalFileName = images[i].clientName
          const currentDate = new Date()
          // eslint-disable-next-line max-len
          const datePrefix = currentDate.toISOString().replace(/[:.]/g, '') // Convert date to string and remove colons and dots
          const newFileName = `${datePrefix}${originalFileName}` // Combine date prefix with original file name
          const imgPath = await cloudinary.upload(images[i], newFileName, { // Use new file name while uploading
            folder: 'orders',
            unique_filename: true,
            replace: false,
          })
          console.log('imgPath',imgPath)
          paths[i] = imgPath.secure_url
        }
        var imagesPath=''
        imagesPath= JSON.stringify(paths)
        console.log('payload',payload)
        console.log('imagesPath',imagesPath)
        const order = await CustomerOrder.create({
          customer_id:parseInt(payload.customer_id),
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone_number: payload.phoneNumber,
          email: payload.emailAddress,
          address: payload.address,
          postal_code: payload.postcode,
          state: payload.state,
          clothing_type: payload.clothingTypes,
          images: imagesPath,
          description: payload.description,
          budget: payload.budget,
        })
        console.log('success')
        response.status(201).json({
          message: 'Order created successfully',
          success: true,
          data: order,
        })
      }
    } catch(e){
      console.log(e)
      response.json({
        message: e,
        type: e.type,
        success: false,
      })
    }
  }
  public async getById ({params, response}: HttpContextContract) {
    const order = await CustomerOrder.find(params.id)
    if (order) {
      response.json({
        message: 'Order found',
        success: true,
        data: order,
      })
    } else {
      response.json({
        message: 'Order not found',
        success: false,
      })
    }
  }
}

