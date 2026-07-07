import { errorHandler } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler Middleware', () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {} as Request;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    mockNext = jest.fn() as NextFunction;
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should mask unexpected errors with a 500 status and standard JSON', () => {
    const mockError = new Error('Secret Internal Failure');

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      reason: 'internal_server_error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  });

  it('should handle errors without a message property', () => {
    const errorString = 'Just a string error';
    
    errorHandler(errorString as unknown as Error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      reason: 'internal_server_error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  });
});
