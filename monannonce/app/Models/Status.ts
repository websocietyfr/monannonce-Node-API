import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Offer from './Offer'

export default class Status extends BaseModel {
  public static table = 'status'

  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public machine_name: string

  @hasMany(() => Offer, {
    foreignKey: 'status_id', // userId column on "Post" model
  })
  public offers: HasMany<typeof Offer>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
