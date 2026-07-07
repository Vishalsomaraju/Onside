import { errorHandler } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler Middleware', () => {
  it('should mask unexpected errors with a 500 status and standard JSON', () => {
    const mockError = new Error('Secret Internal Failure');
    const mockReq = {} as Request;
    
    // We need to mock res.status and res.json
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    
    const mockNext = jest.fn() as NextFunction;
    
    // Spy on console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      reason: 'internal_server_error',
      message: 'An unexpected error occurred. Please try again later.'
    });

    consoleSpy.mockRestore();
  });
});
