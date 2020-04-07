export interface ProxyRequest {
  originalRequest: {
    input: string;
    init: ProxyInit;
  };
}

export interface TemplateProxyRequest extends ProxyRequest {
  ampComponent: AMPComponentForm | AMPComponentList;
}

export interface ProxyResponse {
  body: string;
  init: ResponseInit;
}

export interface TemplateProxyResponse {
  html: string;
  body: string;
  init: ResponseInit;
}

interface AMPComponentForm {
  type: 'amp-form';
  successTemplate?: Template;
  errorTemplate?: Template;
}

interface AMPComponentList {
  type: 'amp-list';
  successTemplate?: Template;
  ampListAttributes?: {
    items: string;
    singleItem: boolean;
    maxItems: string | null;
  };
}

interface Template {
  type: 'amp-mustache';
  payload: string;
}

interface ProxyInit extends RequestInit {
  ampCors?: boolean;
  bypassInterceptorForDev?: boolean;
  prerenderSafe?: boolean;
  responseType?: string;
}
