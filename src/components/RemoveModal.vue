<style>

</style>

<template id="bs-modal">
    <!-- MODAL -->
    <div class="modal zoom" :id="removeModalIndex" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Hi {{operator}}, regarding issue <b style="color: red;">{{issueNumber}}</b>,</h5>
          </div>
          <div class="modal-body">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Do you need to stop sending futher notifications to {{removeModelUser}}?</h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="onSubmit" data-dismiss="modal">Yes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  // import { alert } from 'vue-strap'
  export default {
    template: '#bs-modal',
    props: ["issueNumber", "removeModelUser", "operator", "removeModalIndex"],
    beforeMount: function() {
      // console.log("ASDS", this);
      // console.log(this.modal)
    },
    data: function () {
        return {

        }
    },
    beforeDestroy: function() {
      // console.log("before destroy here");
      // this.reload();
    },
    mounted: function() {
      // console.log("this.$el: ", this.$el)
    },
    methods: {
      ...mapActions({
        reload: 'reload'
      }),
      onSubmit() {
        let self = this;
        let issue_number = self.issueNumber;
        let input_user = self.operator;
        let flag = self.removeModalIndex.split('-')[0];
        if (flag == 'notification') {
          let remove_users = [self.removeModelUser];
          self.$http.post("/remove-users/", {issue_number, remove_users, input_user}).then(res => {
            let res_data = JSON.parse(res.data);
            console.log("on submit res: ", res_data);
            self.$message({
              message: `You successfully updated issue ${issue_number}`,
              type: 'success'
            });
            self.reload();
          }, err => {
            console.log("on submit err: ", res_data);
          })
        } else if (flag == 'department') {
          let departments = [self.removeModelUser];
          self.$http.post("/remove-departments/", {issue_number, departments, input_user}).then(res => {
            let res_data = JSON.parse(res.data);
            console.log("on submit res: ", res_data);
            self.$message({
              message: `You successfully updated issue ${issue_number}.`,
              type: 'success'
            });
            self.reload();
          }, err => {
            console.log("on submit err: ", res_data);
          })
        }
      }
    }
  }
</script>
