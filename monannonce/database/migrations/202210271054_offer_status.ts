import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.createTable('status', (table) => {
      table.increments('id').primary()
      table.string('label', 255).notNullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
    this.schema.createTable('offers', (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.text('description').notNullable()
      table.float('price').notNullable()
      table.string('productPicture').nullable()
      table.integer('status_id').references('id').inTable('status')
      table.integer('user_id').references('id').inTable('users')
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable('offers')
    this.schema.dropTable('status')
  }
}
