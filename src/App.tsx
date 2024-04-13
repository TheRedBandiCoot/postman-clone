import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { langs } from '@uiw/codemirror-extensions-langs';
import { vscodeDark } from '@uiw/codemirror-themes-all';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { AxiosError, AxiosHeaders } from 'axios';
import { CirclePlus, Trash2 } from 'lucide-react';
import pb from 'pretty-bytes';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import axiosInstance from './axios';
import {
  CardProps,
  KeyValueMethod,
  MethodType,
  ParamsType,
  ResInfoType
} from '@/types/types';
import { toast as sooner } from 'sonner';
import Loader from '@/Loader';

function App({ className }: CardProps) {
  const [option, setOption] = useState<MethodType>('GET');
  const [url, setUrl] = useState<string>('');

  const [resInfo, setResInfo] = useState<ResInfoType>({
    status: '',
    size: '',
    time: ''
  });
  const [keyValue, setKeyValue] = useState<KeyValueMethod[]>([
    { key: '', value: '' }
  ]);
  const [header, setHeader] = useState<KeyValueMethod[]>([
    { key: '', value: '' }
  ]);

  const [responseHeader, setResponseHeader] = useState<KeyValueMethod[]>([]);
  const [responseData, setResponseData] = useState<string>('{}');

  const [reqData, setReqData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const list = [...keyValue];
    if (name === 'key') {
      list[idx].key = value;
    } else {
      list[idx].value = value;
    }
    setKeyValue(list);
  };
  const handleHeaderChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { name, value } = e.target;
    const list = [...header];
    if (name === 'key') {
      list[idx].key = value;
    } else {
      list[idx].value = value;
    }
    setHeader(list);
  };

  const handleDelete = (idx: number) => {
    const filterKeyValue = keyValue.filter((_, index) => index !== idx);
    setKeyValue(filterKeyValue);
  };

  const handleHeaderDelete = (idx: number) => {
    const filterKeyValue = header.filter((_, index) => index !== idx);
    setHeader(filterKeyValue);
  };

  const handleAdd = () => {
    setKeyValue(prev => [...prev, { key: '', value: '' }]);
  };
  const handleHeaderAdd = () => {
    setHeader(prev => [...prev, { key: '', value: '' }]);
  };

  const onChange = useCallback((_: never, viewUpdate: ViewUpdate) => {
    const a = viewUpdate.state.doc.toString();
    setReqData(a);
  }, []);

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let params: ParamsType = {};
    let headers: ParamsType = {};
    keyValue.forEach(({ key, value }) => {
      if (key === '') return {};
      params[key] = value;
    });
    header.forEach(({ key, value }) => {
      if (key === '') return {};
      headers[key] = value;
    });
    const dickHead: KeyValueMethod[] = [];
    let requestData;
    setIsLoading(true);

    try {
      requestData = JSON.parse((reqData || null) as string);
      const {
        data: resData,
        headers: resHeader,
        status,
        customData
      } = await axiosInstance({
        url,
        method: option,
        params,
        headers,
        data: requestData
      });
      setResInfo(prev => ({
        ...prev,
        status: String(status),
        time: String(customData?.duration),
        size: String(
          pb(JSON.stringify(resData).length + JSON.stringify(resHeader).length)
        )
      }));
      Object.entries(resHeader).forEach(([key, value]) => {
        dickHead.push({ key, value });
      });
      setResponseHeader(dickHead);
      const stringifyData = JSON.stringify(resData, null, 2);
      setResponseData(stringifyData);
    } catch (error) {
      const { response, config, name } = error as AxiosError;
      if (name === 'SyntaxError') {
        sooner('JSON Data is malformed');
        setResInfo({ status: '', size: '', time: '' });
        setResponseHeader([]);
        setResponseData('{}');
        return;
      }

      const head = response?.headers as AxiosHeaders;
      Object.entries(head).forEach(([key, value]) => {
        dickHead.push({ key, value });
      });
      setResponseHeader(dickHead);
      setResInfo(prev => ({
        ...prev,
        status: String(response?.status),
        time: String(config?.customData?.duration),
        size: String(pb(JSON.stringify(response?.headers).length))
      }));
      setResponseData(JSON.stringify(response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-700 relative">
      <div
        className={`bg-slate-900 h-[97%] w-[98%] rounded-md 
        absolute left-[50%] translate-x-[-50%] 
        top-[50%] translate-y-[-50%]
        `}
      >
        <div className="w-[80%] h-full flex flex-col  m-auto">
          <form
            onSubmit={onsubmit}
            className="flex flex-col justify-start h-[60vh] items-center"
          >
            <div className="w-[70%] h-[20dvh]   flex justify-center items-center">
              <Select
                required
                defaultValue="GET"
                value={option}
                onValueChange={(e: MethodType) => setOption(e)}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent className=" ">
                  <SelectGroup>
                    <SelectLabel>Select Method</SelectLabel>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                className="w-[100%]  rounded-none border-l-0"
                type="url"
                required
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="http://example.com"
              />
              <Button
                className="rounded-none rounded-e-md border-y-[1px] text-base  border-r-[1px]"
                type="submit"
              >
                Send
              </Button>
            </div>
            <div
              className="w-[70%] h-[20dvh]  text-slate-400 
            flex justify-start items-start"
            >
              <Tabs defaultValue="query-params" className="w-[400px]">
                <TabsList className="grid w-[90%] grid-cols-3 gap-x-1">
                  <TabsTrigger value="query-params">Query Params</TabsTrigger>
                  <TabsTrigger value="header">Header</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="query-params">
                  <Card
                    className={
                      'bg-transparent w-[90%] min-h-24 max-h-52 overflow-y-scroll [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgb(168,168,168)] [&::-webkit-scrollbar-thumb]:rounded-xl'
                    }
                  >
                    <CardContent className={`${keyValue.length < 1 && 'p-0'}`}>
                      <div className="flex flex-col mt-[2rem] gap-y-[1rem]">
                        {keyValue.map((item, i) => (
                          <div key={i} className="flex gap-x-[0.7rem]">
                            <Input
                              className="w-[100%]"
                              type="text"
                              name="key"
                              value={item.key}
                              onChange={e => handleInputChange(e, i)}
                              placeholder="key"
                            />
                            <Input
                              className="w-[100%]"
                              type="text"
                              name="value"
                              value={item.value}
                              onChange={e => handleInputChange(e, i)}
                              placeholder="value"
                            />
                            <Button
                              type="button"
                              variant={'destructive'}
                              onClick={() => handleDelete(i)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant={'secondary'}
                        className={`${
                          keyValue.length < 1 && cn('w-full', className)
                        }`}
                        onClick={handleAdd}
                      >
                        <CirclePlus />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="header">
                  <Card
                    className={
                      'bg-transparent w-[90%] min-h-24 max-h-52 overflow-y-scroll [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgb(168,168,168)] [&::-webkit-scrollbar-thumb]:rounded-xl'
                    }
                  >
                    <CardContent className={`${header.length < 1 && 'p-0'}`}>
                      <div className="flex flex-col mt-[2rem] gap-y-[1rem]">
                        {header.map((item, i) => (
                          <div key={i} className="flex gap-x-[0.7rem]">
                            <Input
                              className="w-[100%]"
                              type="text"
                              name="key"
                              value={item.key}
                              onChange={e => handleHeaderChange(e, i)}
                              placeholder="key"
                            />
                            <Input
                              className="w-[100%]"
                              type="text"
                              name="value"
                              value={item.value}
                              onChange={e => handleHeaderChange(e, i)}
                              placeholder="value"
                            />
                            <Button
                              type="button"
                              variant={'destructive'}
                              onClick={() => handleHeaderDelete(i)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant={'secondary'}
                        className={`${
                          header.length < 1 && cn('w-full', className)
                        }`}
                        onClick={handleHeaderAdd}
                      >
                        <CirclePlus />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="json">
                  <div
                    className={`
                      ${responseData.length > 2 ? 'rounded-2xl' : ''}
                      overflow-hidden
                      border-2 border-[#343355] rounded-md
                  `}
                  >
                    <CodeMirror
                      className={`bg-transparent w-[100%] h-auto max-h-32 overflow-y-scroll  [&::-webkit-scrollbar]:bg-transparent  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgba(168,168,168,0.2)] [&::-webkit-scrollbar-thumb]:rounded-3xl text-[0.65rem]
                      
                      `}
                      value={'{\n\t\n}'}
                      height="auto"
                      theme={vscodeDark}
                      extensions={[langs.json()]}
                      basicSetup={{
                        foldGutter: false,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: false
                      }}
                      editable={!false}
                      onChange={onChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </form>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="mx-auto h-[40vh] w-full  flex flex-col justify-start items-center">
              <div className="flex flex-col w-[70%] h-[30%]  justify-start items-start ">
                <div className="space-y-1">
                  <h2 className="text-2xl font-medium leading-none">
                    Response
                  </h2>
                </div>
                <Separator className="my-[0.5rem]" />
                <div className="flex  h-5 items-center space-x-2 text-sm">
                  <div className="flex space-x-1">
                    <div>Status</div>
                    <span className="">:</span>
                    <div>{resInfo.status}</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex space-x-1">
                    <div>Time</div>
                    <span className="">:</span>
                    <div>{resInfo.time}ms</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex space-x-1">
                    <div>Size</div>
                    <span className="">:</span>
                    <div>{resInfo.size}</div>
                  </div>
                </div>
              </div>
              <div
                className="w-[70%] h-[20dvh]  text-slate-400 
            flex justify-start items-start"
              >
                <Tabs defaultValue="body" className="w-[400px]">
                  <TabsList className="grid w-[90%] grid-cols-2 gap-x-1">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="header">Header</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body">
                    <div
                      className={`
                      ${responseData.length > 2 ? 'rounded-2xl' : ''}
                      overflow-hidden
                      border-2 border-[#343355] rounded-md
                  `}
                    >
                      <CodeMirror
                        className={`bg-transparent w-[100%] h-auto max-h-32  overflow-y-scroll  [&::-webkit-scrollbar]:bg-transparent  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgba(168,168,168,0.2)] [&::-webkit-scrollbar-thumb]:rounded-3xl text-[0.65rem]
                      `}
                        value={responseData || '{}'}
                        height="auto"
                        theme={vscodeDark}
                        extensions={[langs.json()]}
                        basicSetup={{
                          foldGutter: false,
                          dropCursor: false,
                          allowMultipleSelections: false,
                          indentOnInput: false
                        }}
                        editable={false}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="header">
                    <Card
                      className={
                        'bg-transparent w-[90%] h-[7rem] overflow-y-scroll [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[rgb(168,168,168)] [&::-webkit-scrollbar-thumb]:rounded-xl'
                      }
                    >
                      <CardContent className={`${header.length < 1 && 'p-0'}`}>
                        <div className="flex flex-col mt-0 py-[0.5rem]  gap-y-[0.1rem]">
                          {responseHeader.map(head => {
                            const { key, value } = head;
                            return (
                              <span className="" key={key}>
                                {key} : {value}
                              </span>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
