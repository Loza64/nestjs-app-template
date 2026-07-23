import { Injectable, RequestMethod } from "@nestjs/common";
import PathRule from "src/common/models/path.rule";

@Injectable()
export class SecurityRules {

  constructor() { }

  private readonly publicEndpoint: PathRule[] = [
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/signup', methods: ['POST'] },
  ];

  private readonly authEndpoint: PathRule[] = [
    { path: '/api/auth/profile', methods: ['GET', 'PATCH'] },
    { path: '/api/auth/profile/password', methods: ['PATCH'] },
  ];

  public readonly methodMap: Readonly<Partial<Record<RequestMethod, string>>> = {
    [RequestMethod.GET]: 'GET',
    [RequestMethod.POST]: 'POST',
    [RequestMethod.PUT]: 'PUT',
    [RequestMethod.DELETE]: 'DELETE',
    [RequestMethod.PATCH]: 'PATCH',
    [RequestMethod.OPTIONS]: 'OPTIONS',
    [RequestMethod.HEAD]: 'HEAD',
    [RequestMethod.ALL]: 'ALL',
  };

  public normalizePath(path = ''): string {
    return ('/' + path).replace(/\/+/g, '/').replace(/\/+$/, '');
  }

  public isPublicEndpoint(path: string, method: string): boolean {
    const normalized = this.normalizePath(path);
    return this.publicEndpoint.some(({ path: rulePath, methods }) =>
      rulePath === normalized && methods.includes(method)
    );
  }

  public isAuthEndpoint(path: string, method: string): boolean {
    const normalized = this.normalizePath(path);
    return this.authEndpoint.some(({ path: rulePath, methods }) =>
      rulePath === normalized && methods.includes(method)
    );
  }

}