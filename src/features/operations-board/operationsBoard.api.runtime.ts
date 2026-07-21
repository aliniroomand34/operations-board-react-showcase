/**
 * Board mock API runtime — thin facade over the shared demo store.
 * Keeps feature imports stable while Overview / Pipeline share the same state.
 */
export {
  MOCK_API_DELAY_MS,
  beginMockApiCall,
  cloneCurrentBoard,
  createMockApiError,
  getMutableBoardState,
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
} from "@/mocks/demoStore";
