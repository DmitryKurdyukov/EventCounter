/**
 * Represents an event type that can be tracked.
 * 
 * An event has a unique identifier, display properties (name, color, icon),
 * optional comment, favorite status, and a list of event occurrences.
 */
export interface EventType {
  /** Unique identifier for the event */
  id: string
  /** Display name of the event */
  name: string
  /** Hex color code for the event (e.g., "#1E3A8A") */
  color: string
  /** Emoji icon representing the event */
  icon: string
  /** Optional comment/description for the event */
  comment: string
  /** Whether the event is marked as favorite */
  favorite: boolean
  /** Array of event occurrences (timestamps and comments) */
  data: EventDataItemType[]
}

/**
 * Represents a single occurrence of an event.
 * 
 * Contains the timestamp when the event occurred and an optional comment
 * for that specific occurrence.
 */
export interface EventDataItemType {
  /** ISO 8601 formatted date-time string (e.g., "2024-12-25T14:30:45.123Z") */
  dateTime: string
  /** Optional comment for this specific event occurrence */
  comment: string
}