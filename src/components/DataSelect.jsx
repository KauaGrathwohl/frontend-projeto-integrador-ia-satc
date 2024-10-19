import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AutoComplete, message } from 'antd';
import { CloseCircleFilled, DownOutlined, UpOutlined, LoadingOutlined } from '@ant-design/icons';
import request from '../utils/request';

export default function DataSelect(props) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const autoCompleteRef = useRef();
  const suffixIcon = useMemo(() => {
    if (props.disabled) {
      return null;
    }

    if (searchValue || props.value) {
      return <CloseCircleFilled onClick={() => handleClear(true)} />;
    }

    if (!isOpen) {
      return <DownOutlined onClick={() => handleClear()} />;
    }

    if (loading) {
      return <LoadingOutlined />;
    }

    return <UpOutlined />
  }, [loading, searchValue, isOpen, props.value, props.disabled]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      fetch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (!isOpen) {
      if (!props.value) {
        handleClear();
      }

      return;
    }

    setLoading(true);
    fetch();
  }, [isOpen]);

  const fetch = () => {
    const { url, params } = props;

    request(url, {
      method: 'GET',
      params: { ...params },
    }).then((data) => {
      setLoading(false);
      setData(data);
    }).catch((err) => {
      setLoading(false);
      message.error(err);
      handleClear();
    });
  }

  const formatOptions = () => {
    return data.map((item, index) => ({
      value: index.toString(),
      label: formatLabel(item),
    }));
  }

  const formatLabel = (item) => {
    const { format } = props;

    if (!item) {
      return '';
    }

    if (typeof format === 'function') {
      return format(item);
    }

    if (typeof format === 'string') {
      return item[format];
    }

    return item.descricao || '';
  }

  function handleClear(removeValue) {
    if (removeValue) {
      props.onChange?.(null);
    }

    setData([]);
    setSearchValue('');
    setLoading(false);
    autoCompleteRef.current?.blur?.();
  }

  const onSelect = (strIndex) => {
    const index = Number(strIndex);
    const value = data[index];

    props.onChange?.(value);
  }

  const onKeyDown = (e) => {
    const key = e?.key?.toLowerCase?.();

    if (['backspace', 'delete'].includes(key) && props.value) {
      props.onChange?.(null);
    }
  }

  return (
    <AutoComplete {...props}
      ref={autoCompleteRef}
      defaultActiveFirstOption
      onSelect={onSelect}
      value={props.value ? formatLabel(props.value) : searchValue}
      suffixIcon={suffixIcon}
      style={{ width: '100%' }}
      options={formatOptions(data)}
      filterOption={false}
      onSearch={(value) => setSearchValue(value)}
      onKeyDown={onKeyDown}
      onDropdownVisibleChange={(open) => setIsOpen(open)} />
  );
}