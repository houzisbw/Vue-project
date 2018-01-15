<!--双色球中奖细则-->
<template>
    <div>
      <div class="wrap">
        <div class="title">
          <span class="title-word">中奖细则</span>
        </div>
        <div class="lottery-prize-table">
          <table>
            <tr>
              <th rowspan="2" class="level">等级</th>
              <th colspan="2" width="130">中奖条件</th>
              <th rowspan="2">奖金分配</th>
              <th rowspan="2" class="probability">中奖概率</th>
            </tr>
            <tr>
              <th width="180">红球</th>
              <th>蓝球</th>
            </tr>
            <tr>
              <td>一等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
              <td>&ge;500万</td>
              <td>0.0000056%</td>
            </tr>
            <tr>
              <td>二等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
              </td>
              <td>浮动(几十万)</td>
              <td>0.0000846%</td>
            </tr>
            <tr>
              <td>三等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
              <td>3000元</td>
              <td>0.0009142%</td>
            </tr>
            <tr>
              <td rowspan="2">四等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
              </td>
              <td rowspan="2">200元</td>
              <td rowspan="2">0.0434228%</td>
            </tr>
            <tr>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
            </tr>
            <tr>
              <td rowspan="2">五等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
              </td>
              <td rowspan="2">10元</td>
              <td rowspan="2">0.7757707%</td>
            </tr>
            <tr>
              <td>
                <span class="red"></span>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
            </tr>
            <tr>
              <td rowspan="3">六等奖</td>
              <td>
                <span class="red"></span>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
              <td rowspan="3">5元</td>
              <td rowspan="3">6.25%</td>
            </tr>
            <tr>
              <td>
                <span class="red"></span>
              </td>
              <td>
                <span class="blue"></span>
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td>
                <span class="blue"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="bottom-padding">
      </div>
    </div>
</template>

<script>
	export default {
		name: 'lotteryPrizeRule'
	}
</script>

<style lang="less" type="text/less" scoped>
  .wrap{
    margin: 20px auto;
    width:1200px;
    height:600px;
    background-color: #fff;
    border:1px solid #d3d3d3;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #d3d3d3;
    .title{
      height:50px;
      border-bottom: 1px solid #cbcbcb;
      border-radius: 10px 10px 0 0;
      line-height: 50px;
      padding-left: 50px;
      background: url('./../../assets/icon/lottery-prize.png') 15px center no-repeat #f1f1f1;
      background-size: 30px 30px;
      .title-word{
        font-size: 17px;
        padding-left:10px;
        padding-right: 50px;
        font-weight: bold;
        color: #afafaf;
        font-family: SansSerif;
      }
    }
    .lottery-prize-table{
      padding: 20px;
      width:60%;
      margin:0 auto;
      table{
        border-collapse: collapse;
        width:100%;
        margin:20px auto 50px auto;
        @wordColor: #747474;
        th{
          text-align: center;
          vertical-align: middle;
          background-color: #ececec;
          border:1px solid #ffffff;
          padding: 10px 5px;
          color:@wordColor;
          font-size: 15px;
        }
        .probability{
          border-right:none!important;
        }
        .level{
          border-left:none!important;
        }
        td{
          padding:10px 5px;
          text-align: center;
          vertical-align: middle;
          border:1px solid #ececec;
          font-size: 12px;
          color:@wordColor;
          @ballSize:15px;
          .red{
            display: inline-block;
            width:@ballSize;
            height:@ballSize;
            background-color: #e05244;
            border-radius: @ballSize;
          }
          .blue{
            display: inline-block;
            width:@ballSize;
            height:@ballSize;
            background-color: #4789ff;
            border-radius: @ballSize;
          }
        }
      }
    }
  }
  .bottom-padding{
    height:200px;
    width:100%;
  }
</style>
