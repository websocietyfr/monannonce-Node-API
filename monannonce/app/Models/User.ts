import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Offer from './Offer'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public zip_code: string

  @column()
  public city: string

  @column()
  public country: string

  @column()
  public identifical_file: string

  @column()
  public profile_picture: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Offer, {
    foreignKey: 'user_id', // userId column on "Post" model
  })
  public offers: HasMany<typeof Offer>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

}
