import { DateTime } from 'luxon'
import Status from 'App/Models/Status'
import User from 'App/Models/User'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Offer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public productPicture: string | null

  @column()
  public category: string

  @column()
  public status_id: number

  @belongsTo(() => Status, {
    foreignKey: 'status_id'
  })
  public status: BelongsTo<typeof Status>

  @column()
  public user_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
