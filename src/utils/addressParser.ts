/**
 * Parses a US address string into street and city/state components
 * Expected format: "Street Address, City, State"
 *
 * @param address - Full address string (e.g., "123 Main St, New York, NY")
 * @returns Object with street and cityState, or null if parsing fails
 */
export interface ParsedAddress {
  street: string
  cityState: string
}

export function parseAddress(address: string): ParsedAddress | null {
  if (!address || typeof address !== 'string') {
    return null
  }

  // Find the LAST comma (separates state from city)
  const lastCommaIndex = address.lastIndexOf(',')

  if (lastCommaIndex <= 0) {
    // No commas found, can't parse
    return null
  }

  // Extract state (everything after last comma)
  const beforeState = address.substring(0, lastCommaIndex)
  const state = address.substring(lastCommaIndex + 1).trim()

  // Find the SECOND-TO-LAST comma (separates city from street)
  const secondLastCommaIndex = beforeState.lastIndexOf(',')

  if (secondLastCommaIndex <= 0) {
    // Only one comma found, treat as "street, state"
    return {
      street: beforeState.trim(),
      cityState: state
    }
  }

  // Extract street and city
  const street = beforeState.substring(0, secondLastCommaIndex).trim()
  const city = beforeState.substring(secondLastCommaIndex + 1).trim()

  return {
    street,
    cityState: `${city}, ${state}`
  }
}

/**
 * Formats a parsed address for display with proper line breaks
 *
 * @param address - Full address string
 * @returns JSX element with formatted address
 */
export function formatAddressLines(address: string): JSX.Element {
  const parsed = parseAddress(address)

  if (!parsed) {
    // Fallback: display as-is
    return <div>{address}</div>
  }

  return (
    <>
      <div>{parsed.street}</div>
      <div style={{ whiteSpace: 'nowrap' }}>{parsed.cityState}</div>
    </>
  )
}
