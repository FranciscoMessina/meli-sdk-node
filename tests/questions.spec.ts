import "mocha"
import {assert, expect} from 'chai'
import { Meli } from "../src"


describe('Mercado Libre SDK', () => {
   let meli: Meli;
   before(async function SetUpMeliAccount() {
      meli = await Meli.create()
      meli.setAccount({
         accountId: 1121534928,
         accessToken: 'APP_USR-6545800455826293-092421-2aa86c2e10fb922b12bca37c63f69328-1121534928',
      })
   })

   it('Gets some questions', async () => {
      const { data, error } = await meli.getQuestions({ sellerId: meli.accountId!})

      assert.isNull(error, `Received an error from MELI, please check you have the correct credentials configured. ERROR = ${error?.message}`)
      assert.isObject(data)
      expect(data).to.have.property('questions')
   })
})