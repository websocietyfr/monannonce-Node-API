import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.create({
      email: 'saittirite@websociety.fr',
      password: 'monmotdepasse',
      firstname: 'Soufian',
      lastname: 'AIT TIRITE',
      phone: '0602030405',
      address: '8 Rue LEMERCIER',
      zip_code: '75017',
      city: 'Paris',
      country: 'France',
      identifical_file: '',
      profile_picture: null,
    })
  }
}
