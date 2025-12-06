
"""
pyVoIP Integration Module
Provides VoIP calling capabilities using the pyVoIP library
"""

from pyVoIP.VoIP import VoIPPhone, CallState, InvalidStateError
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class PyVoIPManager:
    """Manages VoIP phone connections and calls using pyVoIP"""
    
    def __init__(self, sip_server: str, sip_port: int, username: str, password: str):
        """
        Initialize VoIP phone manager
        
        Args:
            sip_server: SIP server address
            sip_port: SIP server port
            username: SIP username
            password: SIP password
        """
        self.sip_server = sip_server
        self.sip_port = sip_port
        self.username = username
        self.password = password
        self.phone: Optional[VoIPPhone] = None
        self.active_calls: Dict[str, Any] = {}
        
    def start_phone(self) -> bool:
        """
        Start the VoIP phone service
        
        Returns:
            True if started successfully, False otherwise
        """
        try:
            self.phone = VoIPPhone(
                self.sip_server,
                self.sip_port,
                self.username,
                self.password,
                callCallback=self._handle_incoming_call
            )
            self.phone.start()
            logger.info(f"VoIP phone started for user {self.username}")
            return True
        except Exception as e:
            logger.error(f"Failed to start VoIP phone: {e}")
            return False
    
    def stop_phone(self):
        """Stop the VoIP phone service"""
        if self.phone:
            try:
                self.phone.stop()
                logger.info("VoIP phone stopped")
            except Exception as e:
                logger.error(f"Error stopping VoIP phone: {e}")
    
    def make_call(self, number: str) -> Optional[str]:
        """
        Initiate an outbound call
        
        Args:
            number: Phone number to call
            
        Returns:
            Call ID if successful, None otherwise
        """
        if not self.phone:
            logger.error("Phone not initialized")
            return None
        
        try:
            call = self.phone.call(number)
            call_id = str(id(call))
            self.active_calls[call_id] = call
            logger.info(f"Call initiated to {number}, call_id: {call_id}")
            return call_id
        except Exception as e:
            logger.error(f"Failed to make call to {number}: {e}")
            return None
    
    def answer_call(self, call_id: str) -> bool:
        """
        Answer an incoming call
        
        Args:
            call_id: ID of the call to answer
            
        Returns:
            True if answered successfully, False otherwise
        """
        call = self.active_calls.get(call_id)
        if not call:
            logger.error(f"Call {call_id} not found")
            return False
        
        try:
            call.answer()
            logger.info(f"Call {call_id} answered")
            return True
        except InvalidStateError as e:
            logger.error(f"Cannot answer call {call_id}: {e}")
            return False
    
    def hangup_call(self, call_id: str) -> bool:
        """
        Hang up a call
        
        Args:
            call_id: ID of the call to hang up
            
        Returns:
            True if hung up successfully, False otherwise
        """
        call = self.active_calls.get(call_id)
        if not call:
            logger.error(f"Call {call_id} not found")
            return False
        
        try:
            call.hangup()
            del self.active_calls[call_id]
            logger.info(f"Call {call_id} hung up")
            return True
        except Exception as e:
            logger.error(f"Failed to hang up call {call_id}: {e}")
            return False
    
    def get_call_state(self, call_id: str) -> Optional[str]:
        """
        Get the current state of a call
        
        Args:
            call_id: ID of the call
            
        Returns:
            Call state as string, None if call not found
        """
        call = self.active_calls.get(call_id)
        if not call:
            return None
        
        return str(call.state)
    
    def _handle_incoming_call(self, call):
        """
        Callback for incoming calls
        
        Args:
            call: Incoming call object
        """
        call_id = str(id(call))
        self.active_calls[call_id] = call
        logger.info(f"Incoming call received, call_id: {call_id}, from: {call.request.headers.get('From')}")


# Global VoIP manager instance
voip_manager: Optional[PyVoIPManager] = None


def initialize_voip(sip_server: str, sip_port: int, username: str, password: str) -> bool:
    """
    Initialize the global VoIP manager
    
    Args:
        sip_server: SIP server address
        sip_port: SIP server port
        username: SIP username
        password: SIP password
        
    Returns:
        True if initialized successfully, False otherwise
    """
    global voip_manager
    
    voip_manager = PyVoIPManager(sip_server, sip_port, username, password)
    return voip_manager.start_phone()


def get_voip_manager() -> Optional[PyVoIPManager]:
    """Get the global VoIP manager instance"""
    return voip_manager
