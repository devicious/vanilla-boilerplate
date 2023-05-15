import { COMPONENT } from './enums';


export function getUniqueID() {
    let prevId = parseInt(sessionStorage.getItem('__uuidIndex') || '0');
    const id = ++prevId;
    sessionStorage.setItem('__uuidIndex', id.toString());
    return `idx-uuid-${id}`;
}

export function debounce(callback: any, timeout = 500) {
    let timer: any;
    //@ts-ignore
    let context: any = this;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(context, args);
        }, timeout);
    };
}

export function getTargets(id: string, returnAll: boolean = false) {
    const attr = `data-component-${id}`;
    const $targets = document.querySelectorAll(`[${attr}]`);
    const results = [].slice.call($targets);
    return returnAll
        ? results
        : results.filter(($component: HTMLElement) => {
              return !getStatus($component, id);
          });
}

export function getHandlers($component: HTMLElement) {
    const $handlers = $component.querySelectorAll(`[${COMPONENT.HANDLER}]`);
    return [].slice.call($handlers).reduce((handlers: any, $handler: HTMLElement) => {
        const handler = $handler.getAttribute(COMPONENT.HANDLER);
        const isCollection = $handler.hasAttribute(COMPONENT.COLLECTION);
        if (handler) {
            if (isCollection) {
                const pointer = handlers[handler];
                if (pointer) {
                    handlers[handler].push($handler);
                } else {
                    handlers[handler] = [$handler];
                }
            } else {
                handlers[handler] = $handler;
            }
        }
        return handlers;
    }, {});
}

export function setReadyStatus($target: HTMLElement, id: string) {
    const attr = `data-component-${id}`;
    $target.setAttribute(attr, COMPONENT.READY);
}

export function getStatus($target: HTMLElement, id: string) {
    const attr = `data-component-${id}`;
    return $target && $target.getAttribute(attr) === COMPONENT.READY;
}


