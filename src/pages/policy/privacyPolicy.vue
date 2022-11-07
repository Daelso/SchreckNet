<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 480px">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Intro / Collection of personal information"
          caption="Legalese"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              A quick summary is that we collect basic personal information when
              you create an account or create/submit various web forms across
              the site. This website is free to use without an account but to
              access all features one is required. All information entered in
              the registration form and various forms throughout the site is
              entered into our database which helps provide the content you
              enjoy. At present, the only personal information collected is your
              email address.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="monitor"
          label="Non-personal information gathering"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We collect a score of non-personal information as you navigate the
              site such as IP address, links visited and the various character
              data that you enter into our forms. This is so that we can store
              and provide to you any characters in which you would like to save.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="note_add"
          label="Managing your data"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              You are able to access, add to, update and delete certain Personal
              Information about you. The information you can view, update, and
              delete may change as the Website or Services change. When you
              update information, however, we may maintain a copy of the
              unrevised information in our records. Some information may remain
              in our private records after your deletion of such information
              from your account. We will retain and use your information as
              necessary to comply with our legal obligations, resolve disputes,
              and enforce our agreements. We may use any aggregated data derived
              from or incorporating your Personal Information after you update
              or delete it, but not in a manner that would identify you
              personally. Once the retention period expires, Personal
              Information shall be deleted. Therefore, the right to access, the
              right to erasure, the right to rectification and the right to data
              portability cannot be enforced after the expiration of the
              retention period.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="query_stats"
          label="Use and processing of collected information"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              All information collected is used to better improve and curate a
              personalized user experience. We require email addresses to verify
              ownership of an account, provide login authentication and provide
              password reset functions. We may use various account information
              for statistical analysis, review or comparison. Account creation
              exists purely as a means to associate data to a user.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="folder_open"
          label="Information transfer and storage"
          caption="Our servers are run through heroku"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              Depending on your location, data transfers may involve
              transferring and storing your information in a country other than
              your own. You are entitled to learn about the legal basis of
              information transfers to a country outside the European Union or
              to any international organization governed by public international
              law or set up by two or more countries, such as the UN, and about
              the security measures taken by us to safeguard your information.
              If any such transfer takes place, you can find out more by
              inquiring with us using the information provided in the contact
              section.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="child_care"
          label="Privacy of children"
          caption="Users under the age of 13 require parental approval"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We do not knowingly collect any Personal Information from children
              under the age of 13. If you are under the age of 13, please do not
              submit any Personal Information through our Website or Service. We
              encourage parents and legal guardians to monitor their children's
              Internet usage and to help enforce this Policy by instructing
              their children never to provide Personal Information through our
              Website or Service without their permission. If you have reason to
              believe that a child under the age of 13 has provided Personal
              Information to us through our Website or Service, please contact
              us.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="drafts"
          label="Newsletter"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              In the future we may offer electronic newsletters to which you may
              voluntarily subscribe at any time. You may choose to stop
              receiving our newsletter or marketing emails by following the
              unsubscribe instructions included in these emails or by contacting
              us. However, you will continue to receive essential transactional
              emails.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator icon="cookie" label="Cookies" dark>
          <q-card>
            <q-card-section class="backgroundDefault">
              A cookie is a text file containing information which is downloaded
              to your computer or mobile device when you visit a website.
              Cookies are useful because they allow websites to recognise a
              user's device. Cookies are then sent back to the originating
              website on each subsequent visit, or to another website that
              recognises that cookie. You can find more information about
              cookies at: www.allaboutcookies.org.
              <br />
              <br />
              We use cookies to provide user authentication and verification as
              well as provide additional security to the end-user. The use of
              cookies is required to provide a unique and full user experience.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="featured_video"
          label="Advertisement"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We may display online advertisements and we may share aggregated
              and non-identifying information about our customers that we
              collect through the registration process or through online surveys
              and promotions with certain advertisers. We do not share
              personally identifiable information about individual customers
              with advertisers. In some instances, we may use this aggregated
              and non-identifying information to deliver tailored advertisements
              to the intended audience.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="link"
          label="Links to other sites"
          caption="We do not take responsibility for the actions, policies or result of visiting outside websites"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              Our Website contains links to other websites that are not owned or
              controlled by us. Please be aware that we are not responsible for
              the privacy practices of such other websites or third-parties. We
              encourage you to be aware when you leave our Website and to read
              the privacy statements of each and every website that may collect
              Personal Information.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="https"
          label="Data Security"
          caption="Great care has been taken to protect your data"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We strive to secure your data behind multiple layers of security
              and authentication that is free from unauthorized access, use or
              disclosure. However, no data transmission over the Internet or
              wireless network can be guaranteed. Therefore, while we strive to
              protect your Personal Information, you acknowledge that (i) there
              are security and privacy limitations of the Internet which are
              beyond our control; (ii) the security, integrity, and privacy of
              any and all information and data exchanged between you and our
              Website cannot be guaranteed; and (iii) any such information and
              data may be viewed or tampered with in transit by a third-party,
              despite best efforts.
              <br />
              <br />
              All user passwords are encrypted and hashed for our users
              security.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="key"
          label="Data breach"
          caption="We will notify all users ASAP"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              In the unfortunate event of a data breach or compromise of user
              data we will be sure to send out an email to all affected users as
              well as make it known on the front page of the website. We will
              quickly reach out to and cooperate with law enforcement as well as
              any following investigations.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
.backgroundDefault {
  background-color: #171a1e;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "privacy-policy",
});
</script>
