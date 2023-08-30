import {genChartByAiAsyncMqUsingPOST} from '@/services/ant-design-pro/chartController';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {useState} from 'react';
import {ProForm} from "@ant-design/pro-form";
import useForm = ProForm.useForm;

/**
 * 添加图表（异步）
 * @constructor
 */
const AddchartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);

    // 对接后端
    const params = {
      ...values,
      file: undefined,
    };

    try {
      // const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      const res = await genChartByAiAsyncMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败：' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title={'智能分析'}>
        <Form
          name="addChart"
          labelAlign={'left'}
          labelCol={{span: 4}}
          onFinish={onFinish}
          initialValues={{}}
          form={form}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{required: true, message: '请输入你的分析目标'}]}
          >
            <TextArea placeholder="请输入你的分析目标，比如：分析用户增长趋势"/>
          </Form.Item>
          <Form.Item name="name" label="图表名称">
            <TextArea placeholder="请输入图表名称"/>
          </Form.Item>
          <Form.Item name="chartType" label="图表类型">
            <Select
              options={[
                {value: '折线图', label: '折线图'},
                {value: '柱状图', label: '柱状图'},
                {value: '堆叠图', label: '堆叠图'},
                {value: '饼图', label: '饼图'},
                {value: '雷达图', label: '雷达图'},
              ]}
            />
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined/>}>上传csv文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{span: 16, offset: 4}}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddchartAsync;
