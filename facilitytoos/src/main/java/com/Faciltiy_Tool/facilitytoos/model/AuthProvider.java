package com.Faciltiy_Tool.facilitytoos.model;

import com.microsoft.graph.authentication.IAuthenticationProvider;
import com.microsoft.graph.http.IHttpRequest;

/**
 * This class manages authentication, either from azure or local
 */
public enum AuthProvider implements IAuthenticationProvider {
    azure,
    local;

    @Override
    public void authenticateRequest(IHttpRequest iHttpRequest) {

    }
}
