import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customer_orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('order_id')
      table.integer('customer_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone_number').notNullable()
      table.string('email').notNullable()
      table.string('address').notNullable()
      table.string('postal_code').notNullable()
      table.string('state').notNullable()
      table.string('clothing_type').notNullable()
      //there will be multiple images
      table.string('images',2000).notNullable()
      table.string('description').notNullable()
      table.string('budget')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
