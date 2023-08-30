import {listMyChartVOByPageUsingPOST} from '@/services/ant-design-pro/chartController';
import React, {useEffect, useState} from 'react';
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {getInitialState} from "@/app";
import {currentUser} from "@/services/ant-design-pro/api";
import {useModel} from "@umijs/max";
import Search from "antd/es/input/Search";

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc'
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState;
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartVOByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏图表的标题
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === 'suceedd') {
              const chartOptions = JSON.parse(data.genChart ?? '');
              chartOptions.title = undefined;
              data.genChart = JSON.stringify(chartOptions);
            }
          })
        }
      } else {
        message.error("搜索我的图表失败");
      }
    } catch (e: any) {
      message.error("搜索我的图表失败");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {
          setSearchParams({
              ...initSearchParams,
              name: value
            }
          )
        }}/>
      </div>
      <div className='margin-16'/>
      <List
        size="large"
        grid={{
          gutter: '4',
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total: total,
        }}
        dataSource={chartList}
        footer={
          <div>
            总数：{total}
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {
                  item.status === 'succeed' && <>
                    <div style={{marginTop: '16px'}}>{'分析目标：' + item.goal}</div>
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
                  </>
                }
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />

    </div>);
};
export default MyChartPage;
