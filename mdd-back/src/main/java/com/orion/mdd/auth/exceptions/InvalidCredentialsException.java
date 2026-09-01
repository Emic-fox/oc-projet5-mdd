package com.orion.mdd.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Invalid credentials")
public class InvalidCredentialsException extends ApiException {

    public InvalidCredentialsException() {
        super();
    }

}
