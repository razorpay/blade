<!--
<template lang="pug">
div
	button.button.button--primary(@click='createNode') Create a node
	p.type.type--pos-small-normal {{message}}
</template>
-->

<template>
  <div class="main-body">
    <div class="status-bar fx ai-c">
      <div v-if="isLoading" class="icon icon--timer"></div>
      <div v-else class="icon icon--resolve"></div>
      <p class="type type--pos-small-normal"><i class="icon icon--adjust"></i>{{ message }}</p>
    </div>
    <div v-if="listLoaded" class="">
      <div class="version-block" v-for="version in versionList" :key="version.id">
          <p class="label-heading type type--pos-medium-bold">{{ version.label }}</p>
          <p class="type type--pos-small-normal content" v-html="version.description.replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
          <div class="more-info fx ai-c">
            <img class="user-img" :src="version.user.img_url" />
            <div class="info">
              <p class="type type--pos-small-bold content">{{ version.user.handle }}</p>
              <p class="type type--pos-small-normal content" v-html="getFormattedDateTime(version.created_at)"></p>
            </div>
        </div>
      </div>
      <div class="section-footer fx jc-c">
        <p v-if="listEnd" class="type type--pos-small-normal content type-muted">~~~ That's all Folks! ~~~</p>
        <button v-else :disabled="isLoading" class="button button--primary" v-on:click="loadMore()">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dispatch, handleEvent } from "./uiMessageHandler";
import axios from "axios";

// Add these lines to import the interactive figma-ui components as needed.
import "./figma-ui/js/selectMenu";
import "./figma-ui/js/iconInput";
import "./figma-ui/js/disclosure";
import { type } from 'os';
// Importing old verison history from local JSON file
import json from "./assets/old-version-history.json";

export default {
  data() {
    return {
      message: "Loading...",
      // fileKey: "ht9pEZnQi2WvPjgChbPrnu", // old file
      fileKey: "LV9kjgzhkfsktvbRgTuGJ3", // new file
      figmaToken: "59832-be42bf32-846b-431a-a4ca-bbc529e8b6c2",
      isLoading: true,
      listLoaded: false,
      versions: "",
      prevPageUrl: null,
      nextPageUrl: null,
      versionList: "",
      versionCount: 0,
      listEnd: false,
      newFileFullyLoaded: false,
      oldVersionHistory: json.oldVersionHistory,
      oldVersionHistoryData: "",
    };
  },
  mounted() {
    // Add these lines to initialize the interactive figma-ui components as needed.
    window.selectMenu.init();
    window.iconInput.init();
    window.disclosure.init();

    // The following shows how messages from the main code can be handled in the UI code.
    // handleEvent("nodeCreated", nodeID => {
    //   // this.message = `Node ${nodeID} was created!`;
    // });
    
    const options = {
      headers: {
        'X-Figma-Token': this.figmaToken,
      },
      params: {
        'page_size': 50,
        'before': this.prevPageUrl,
        'after': this.nextPageUrl
      }
    };
    this.fetchResults(options);
  },
  methods: {
    createNode() {
      // This shows how the UI code can send messages to the main code.
      dispatch("createNode");
    },

    fetchResults(options) {
      // dispatch("notify", "notify!!");
      axios
      .get(`https://api.figma.com/v1/files/${this.fileKey}/versions`, options)
      .then(
        response => {
          this.versions = response.data.versions;
          this.prevPageUrl = response.data.pagination.prev_page ? response.data.pagination.prev_page.substr(-9) : null;
          this.nextPageUrl = response.data.pagination.next_page ? response.data.pagination.next_page.substr(-9) : null;
          console.log('this.nextPageUrl', this.nextPageUrl);
          console.log('this.versionCount', this.versionCount);
          if(this.nextPageUrl == null) {
            this.listEnd = true;
            if (this.versionCount == 0) {
              this.versionList = this.versions.filter(function (version) {
                return Boolean(version.description)
              });
            }
            console.log("!EXECUTION _ START!");
            this.oldVersionHistoryData = this.oldVersionHistory.filter(function (version) {
                return Boolean(version.description)
              });
            this.versionList.push(
              ...this.oldVersionHistoryData
            );
            console.log("!EXECUTION _ END!");
            this.populateVersionHistory(this.versionList);
          } else {
            console.log("Versions", this.versions);
            if(this.versionList.length <= 0) {
              this.versionList = this.versions.filter(function (version) {
                return Boolean(version.description)
              });
            } else {
              this.versionList.push(
                ...this.versions.filter(function (version) {
                  return Boolean(version.description)
                })
              );
            }
            if(this.versionCount == this.versionList.length) {
              this.loadMore();
            } else {
              this.versionCount += (this.versionList.length - this.versionCount);
              console.log("Version List", this.versionList);
              this.populateVersionHistory(this.versionList);
            }
          }
        }
      )
    },

    loadMore() {
      this.isLoading = true;
      this.message = "Loading...";
      console.log("Loading More!");
      const options = {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
        params: {
          'page_size': 50,
          'after': this.nextPageUrl
        }
      };
      this.fetchResults(options);
    },

    populateVersionHistory(list) {
      this.message = `Loaded successfully with ${list.length} result!`;
      this.isLoading = false;
      this.listLoaded = true;
    },

    getFormattedDateTime(dt) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let dateTime = new Date(dt);
      let formattedDateTime =
        `${dateTime.getDate()} ${monthNames[dateTime.getMonth()]} ${dateTime.getFullYear()} (${dateTime.getHours()}:${dateTime.getMinutes()})`;
      return formattedDateTime;
    }
  }
};
</script>

<style lang='scss'>
  @import "./figma-ui/figma-plugin-ds";

  body {
    background: #f5f5f5;
  }
  
  .main-body {
    padding: 20px 8px 0;
  }

  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 4px 12px;
    border-bottom: 1px solid #cadcec;
    background: #e9f5ff;
  }

  .content {
    margin: 0;
  }

  .version-block {
    margin-top: 16px;
    padding: 4px 12px 0;
    border: 1px solid #ddd;
    background: #fff;
    box-shadow: 0px 0px 4px rgba(0,0,0,0.05);
  }

  .label-heading {
    display: block;
    padding: 8px 0;
    margin: 0 0 8px;
    border-bottom: 1px solid #ddd;
  }

  .user-img {
    width: 32px;
    height: 32px;
    border-radius: 100px;
    margin-right: 8px;
  }

  .more-info {
    margin: 8px 0 0;
    padding: 8px 0 10px;
    border-top: 1px solid #ddd;
  }

  .fx {
    display: flex;

    &.ai-c {
      align-items: center;
    }

    &.jc-c {
      justify-content: center;
    }

    .icon {
      width: 20px;
      height: 20px;
      background-size: 20px;
      margin-right: 2px;
    }

    .type {
      margin: 0;
    }

    .type-muted {
      opacity: 0.35;
    }
  }

  .section-footer {
    margin: 20px auto;
  }
</style>