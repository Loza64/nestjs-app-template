import { Injectable, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { DeepPartial } from 'typeorm';
import { PermissionService } from '../services/permission/permission.service';
import { SecurityRules } from 'src/security/rules/security.rules';
import { Permission } from '../domain/entity/permission.entity';

@Injectable()
export class PermissionsSeeder implements OnApplicationBootstrap {

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionService,
    private readonly rules: SecurityRules
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    const controllers = this.discoveryService.getControllers();
    const permissionsMap = new Map<string, DeepPartial<Permission>>();
    const globalPrefix = 'api';

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = this.rules.normalizePath(
        this.reflector.get<string>(PATH_METADATA, instance.constructor)
      );

      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === 'constructor') continue;

        const handler = prototype[methodName];
        if (typeof handler !== 'function') continue;

        const routePath = this.reflector.get<string>(PATH_METADATA, handler);
        const methodNum = this.reflector.get<RequestMethod>(METHOD_METADATA, handler);

        if (!routePath || methodNum === undefined) continue;

        const method = this.rules.methodMap[methodNum];
        const fullPath = this.rules.normalizePath(`${globalPrefix}/${controllerPath}/${routePath}`);

        if (!method || !fullPath) continue;

        if (this.rules.isPublicEndpoint(fullPath, method)) continue;
        if (this.rules.isAuthEndpoint(fullPath, method)) continue;

        const key = `${method}:${fullPath}`;
        permissionsMap.set(key, { path: fullPath, method });
      }
    }

    await Promise.allSettled(
      [...permissionsMap.values()].map((permission) =>
        this.permissionsService.upsert(permission),
      ),
    );
  }
}