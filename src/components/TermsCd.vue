<template>
      <q-card>
        <q-toolbar class="bg-teal text-white">
          <q-avatar>
            <img src="/assets/logo.jpeg">
          </q-avatar>

          <q-toolbar-title>Terms and Conditions</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section style="max-height: 50vh"  class="scroll">
          <div q-pa-md v-if="$store.state.usertype !== 'Engineer'">
            <ul style="list-style-type: disc;">
            <li>
            <p>We <span style="text-decoration: underline;">vplusu.in</span> (<strong>Green Power Solution</strong>) are the only arbitrator among the serviceengineers (Freelancers) and the customers, otherwise we are not legal obligate for anyissues occur on the site.</p>
            </li>
            <li>
            <p>The Service engineers who authorized by vplusu.in (Green Power Solution). They areself-employed, even though who people shouldn&rsquo;t get any pay scales from the company.</p>
            </li>
            <li>
            <p>Kindly negotiate of this service and spare charges with the engineers, who properlyhandle the complaints.</p>
            </li>
            <li>
            <p>If any disaster occurs, the service engineers who are the only responsible for that.</p>
            </li>
            <li>
            <p>If there are no other complaints found from the customer site or else the customers are not willing to repair the product services, who must be to pay the minimum service charges from which the company already fixed to the service engineers (Freelancers).</p>
            </li>
            </ul>
          </div>
          <div q-pa-md v-else>
            <ul>
            <li>We <span style="text-decoration: underline;"><strong>vplusu.in</strong></span> (<strong>Green Power Solution</strong>) are the only arbitrator among the service<br />engineers (Freelancers) and the customers, otherwise we are not legal obligate for any<br />issues occur on the site.</li>
            <li>The Service engineers are considered as a &lsquo;Freelancers&rsquo;, so that the company will never<br />pay any compensations to the Freelancers.</li>
            <li>Freelancers who only request to get the correct service charge and spare charges from<br />the customers.</li>
            <li>If there are no other complaints arise on the product or else the customers are not ready<br />to repair the product at the time of service, though the service engineers request to pay<br />the minimum service charge from the customers.</li>
            <li>The Service engineers who can be requisites to insure for health and life insurances<br />from the Government authorized company.</li>
            <li>If there is any malfunction occurs, the service engineer will be terminated by the<br />company without any intimation.</li>
            <li>When the service engineer is inactive on the site who handle the complaints, or<br />disconnect the service call from the customers, or the customer supposed to clear the<br />complaints by the call, although the company will get back the refundable amount of<br />service agreement. (This facility resolves only by the telephonic calls, other than the<br />service engineer can collect only minimum service charge from the customers.)</li>
            <li>At the service time, the service engineers who can wear the identity card and company<br />uniform properly.</li>
            <li>The Service engineers who authorities to attend the complaint within 48hrs, or else the<br />complaint will be swapped to the homepage without any intimation.</li>
            <li>The Service engineers are permitted to get only 10 complaints per day.</li>
            <li>While attend the complaints, if the complaint closes properly or not by the service<br />engineers other than they won&rsquo;t allow to take further complaint from the service portal.</li>
            </ul>
            <p style="padding-left: 40px;"><strong>NOTE:</strong><br />Even if any issues occur on the customer site or to the service engineers, the company<br />wouldn&rsquo;t take any responsible for that.</p>              
          </div>
        </q-card-section>


      </q-card>
</template>

<script>
export default {


}
</script>

<style>

</style>