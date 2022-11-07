<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 480px">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Account Membership"
          caption="We reserve the right to disable or delete your account at any time."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              If you create an account on the Website, you are responsible for
              maintaining the security of your account and you are fully
              responsible for all activities that occur under the account and
              any other actions taken in connection with it. Providing false
              contact information of any kind may result in the termination of
              your account. You must immediately notify us of any unauthorized
              uses of your account or any other breaches of security. We will
              not be liable for any acts or omissions by you, including any
              damages of any kind incurred as a result of such acts or
              omissions. We may suspend, disable, or delete your account (or any
              part thereof) if we determine that you have violated any provision
              of this Agreement or that your conduct or content would tend to
              damage our reputation and goodwill. If we delete your account for
              the foregoing reasons, you may not re-register for our Services.
              We may block your email address and Internet protocol address to
              prevent further registration.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="monitor"
          caption="You own the data, but grant us permission to use it."
          label="User Content"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We do not own any data, information or material ("Content") that
              you submit on the Website in the course of using the Service. You
              shall have sole responsibility for the accuracy, quality,
              integrity, legality, reliability, appropriateness, and
              intellectual property ownership or right to use of all submitted
              Content. We may, but have no obligation to, monitor Content on the
              Website submitted or created using our Services by you. Unless
              specifically permitted by you, your use of the Website does not
              grant us the license to use, reproduce, adapt, modify, publish or
              distribute the Content created by you or stored in your user
              account for commercial, marketing or any similar purpose. But you
              grant us permission to access, copy, distribute, store, transmit,
              reformat, display and perform the Content of your user account
              solely as required for the purpose of providing the Services to
              you. Without limiting any of those representations or warranties,
              we have the right, though not the obligation, to, in our own sole
              discretion, refuse or remove any Content that, in our reasonable
              opinion, violates any of our policies or is in any way harmful or
              objectionable.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="note_add"
          label="Copyright Infringement"
          caption="If you feel your copyright has been violated, please contact us immediately."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We respect the intellectual property of others and ask that users
              of our Site do the same. The basis of our site is rooted in the
              World of Darkness which firmly belongs to Paradox Interactive. We
              offer no challenge to this and adhere strictly the Dark Pack
              licensing agreement.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="query_stats"
          label="Backups"
          caption="We will do our best!"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We perform regular backups of the Website and Content, however,
              these backups are for our own administrative purposes only and are
              in no way guaranteed. You are responsible for maintaining your own
              backups of your data. We do not provide any sort of compensation
              for lost or incomplete data in the event that backups do not
              function properly. We will do our best to ensure complete and
              accurate backups, but assume no responsibility for this duty.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="folder_open"
          label="Indemnification"
          caption="You can't sue us unless you're paying for it."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              You agree to indemnify and hold us our affiliates, directors,
              officers, employees, and agents harmless from and against any
              liabilities, losses, damages or costs, including reasonable
              attorneys' fees, incurred in connection with or arising from any
              third-party allegations, claims, actions, disputes, or demands
              asserted against any of them as a result of or relating to your
              Content, your use of the Website or Services or any willful
              misconduct on your part.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="child_care"
          label="Dispute Resolution"
          caption="Try reaching out to us before you send the lawyers."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              The formation, interpretation, and performance of this Agreement
              and any disputes arising out of it shall be governed by the
              substantive and procedural laws of the United States without
              regard to its rules on conflicts or choice of law and, to the
              extent applicable, the laws of the United States. The exclusive
              jurisdiction and venue for actions related to the subject matter
              hereof shall be the courts located in the United States, and you
              hereby submit to the personal jurisdiction of such courts. You
              hereby waive any right to a jury trial in any proceeding arising
              out of or related to this Agreement. The United Nations Convention
              on Contracts for the International Sale of Goods does not apply to
              this Agreement.
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
  name: "terms-of-use",
});
</script>
