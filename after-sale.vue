<script>
import DavinciHeader from "~/components/Header"
import DavinciFooter from "~/components/Footer"
import AfterSaleMap from "~/components/rem/after-sale-map/index.vue"

export default {
  name: "after-sale",
  components: {
    DavinciHeader,
    DavinciFooter,
    AfterSaleMap,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    scrollTo() {
      const height = this.$refs.bg.clientHeight
      scrollTo({ top: height, behavior: "smooth" })
    },
  },
}
</script>

<template>
  <div class="container">
    <client-only>
      <DavinciHeader blur />
    </client-only>

    <div class="body-container">
      <div ref="bg" class="bg-box">
        <!-- <img class="bg-box-button" src="~assets/image/chevron-down.png" alt="" @click="scrollTo" /> -->
      </div>

      <div class="info-container">
        <h1 class="title">保修服务</h1>
        <p class="desc">随心所驭的骑行，有官方售后服务保驾护航</p>

        <div class="show-content-box">
          <div class="left">
            <img src="~assets/image/after-sale/desc-left.png" alt="" />
            <div class="desc-box">
              <h1>整车质保</h1>
              <p class="desc-box-desc">新车享受 2 年不限里程质保服务</p>
            </div>
          </div>

          <div class="right">
            <img src="~assets/image/after-sale/desc-right.png" alt="" />

            <div class="desc-box">
              <h1>三电系统质保</h1>
              <p class="desc-box-desc">包含电池 Pack、电机、逆变器，享受 7 年或 24 万公里（以先到者为准）质保服务</p>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <p class="mini-desc">*在质保期内且正常使用车辆的条件下，如车辆出现的质量问题，达芬骑将进行免费维修。</p>
          <p class="mini-desc">*以上期限以向用户交付新车之日起计算</p>
        </div>
      </div>

      <AfterSaleMap></AfterSaleMap>
    </div>

    <client-only>
      <DavinciFooter />
    </client-only>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;

  .body-container {
    .bg-box {
      position: relative;
      width: 100%;
      height: 100svh;
      background-image: url("~assets/image/after-sale/top-bg.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;

      @include media-device("pad") {
        background-image: url("~assets/image/after-sale/top-bg-pad.png");
      }
      @include media-device("phone") {
        background-image: url("~assets/image/after-sale/top-bg-phone.png");
      }

      &-button {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 25px;
        height: 25px;

        @include media-device("phone") {
          transform: unset;
          left: 48px;
          width: 25px;
          height: 25px;
        }
      }
    }

    .info-container {
      margin: 60px auto 0;
      width: 940px;

      @include media-device("pad") {
        width: 705px;
      }

      @include media-device("phone") {
        margin: 30px auto 0;
        width: 345px;
      }

      .desc {
        margin-top: 20px;
      }

      .show-content-box {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;

        @include media-device("phone") {
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .desc-box {
          height: 142px;
          background: #fcfcfc;
          padding: 30px 20px;

          & > h1 {
            color: #262626;
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
          }

          &-desc {
            color: #8c8c8c;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
            margin-top: 10px;
          }
        }

        @mixin sale-img-size {
          display: inline-block;
          overflow: hidden;
          width: 460px;

          @include media-device("pad") {
            width: 345px;
          }

          @include media-device("phone") {
            width: 345px;
          }

          & > img {
            width: inherit;
            height: 370px;
            object-fit: cover;
          }
        }

        .left {
          @include sale-img-size;
        }

        .right {
          @include sale-img-size;
          @include media-device("phone") {
            margin-top: 20px;
          }
        }
      }
    }

    .detail-box {
      color: #8c8c8c;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      margin-top: 15px;
      margin-bottom: 55px;
      @include media-device("pad") {
        margin-bottom: 170px;
      }

      .mini-desc {
        // prettier-ignore
        margin-bottom: 5Px;
      }
    }
  }
}
</style>
