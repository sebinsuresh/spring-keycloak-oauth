import { HttpInterceptorFn } from "@angular/common/http";

/**
 * Attach credentials - session cookie - to every request.
 * HTTP Client using this shoudl be only used for BFF requests.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    const withCredentials = req.clone({ withCredentials: true, });
    return next(withCredentials);
};