import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CustomerOrder extends BaseModel {
  @column({ isPrimary: true })
  public order_id: number

  @column()
  public customer_id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public phone_number: string

  @column()
  public email: string

  @column()
  public address: string

  @column()
  public postal_code: string

  @column()
  public state: string

  @column()
  public clothing_type: string

  @column()
  public images: string

  @column()
  public description: string

  @column()
  public budget: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
